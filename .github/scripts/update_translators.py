#!/usr/bin/env python3
"""Download and group Weblate translator credits by email."""

import argparse
import json
import logging
import os
import time
from datetime import datetime, timezone
from pathlib import Path

import requests

BASE_URL = "https://hosted.weblate.org"
PROJECT = "databackup"
REPORT_START = "2000-01-01T00:00:00Z"
logger = logging.getLogger(__name__)


def read(response: requests.Response) -> dict:
    logger.info(
        "HTTP %s %s -> %d %s (%d bytes, %.2fs)",
        response.request.method,
        response.url,
        response.status_code,
        response.reason,
        len(response.content),
        response.elapsed.total_seconds(),
    )
    response.raise_for_status()
    return response.json()


def group_by_email(data: list[dict]) -> list[dict]:
    people = {}
    records = 0
    for group in data:
        for language, contributors in group.items():
            for contributor in contributors:
                records += 1
                email = contributor["email"]
                if email not in people:
                    people[email] = contributor | {"change_count": 0, "languages": {}}
                people[email]["change_count"] += contributor["change_count"]
                people[email]["languages"][language] = contributor["change_count"]

    logger.info("Grouped %d records into %d translators", records, len(people))
    return sorted(people.values(), key=lambda person: person["change_count"], reverse=True)


def apply_revisions(people: list[dict], revisions: dict) -> list[dict]:
    matched = 0
    disabled = 0
    deleted = 0
    result = []
    for person in people:
        if person.get("username", "").startswith("deleted-") and person.get(
            "full_name"
        ) == "Deleted User":
            deleted += 1
            continue

        revision = revisions.get(person.pop("email"))
        if revision is not None:
            matched += 1
            if revision.get("enabled") is False:
                disabled += 1
                continue
            person.update({key: value for key, value in revision.items() if key != "enabled"})
        result.append(person)

    logger.info(
        "Matched %d of %d revisions; removed %d disabled and %d deleted translators",
        matched,
        len(revisions),
        disabled,
        deleted,
    )
    return result


def fetch_credits(token: str) -> list:
    with requests.Session() as session:
        session.headers["Authorization"] = f"Token {token}"
        end = datetime.now(timezone.utc).isoformat()
        logger.info(
            "Requesting credits report: project=%s, range=%s..%s, "
            "sort=count descending",
            PROJECT,
            REPORT_START,
            end,
        )
        report = read(
            session.post(
                f"{BASE_URL}/api/projects/{PROJECT}/reports/",
                json={
                    "kind": "credits",
                    "start": REPORT_START,
                    "end": end,
                    "sort_by": "count",
                    "sort_order": "descending",
                },
                timeout=60,
            )
        )

        task_url = BASE_URL + report["task_url"]
        logger.info("Report task: %s", task_url)
        polls = 0
        while True:
            polls += 1
            task = read(session.get(task_url, timeout=60))
            if task["completed"]:
                break
            logger.info("Report is still running; retrying in 2 seconds")
            time.sleep(2)

        result_url = BASE_URL + task["result"]["url"]
        logger.info("Report completed after %d polls: %s", polls, result_url)
        data = read(session.get(result_url, timeout=60))["data"]
        logger.info("Downloaded %d language groups after %d polls", len(data), polls)
        return group_by_email(data)


def main() -> None:
    logging.basicConfig(level=logging.INFO, format="%(levelname)s: %(message)s")
    parser = argparse.ArgumentParser()
    parser.add_argument("--output", type=Path, required=True)
    parser.add_argument("--revisions", type=Path, required=True)
    args = parser.parse_args()
    revisions = json.loads(args.revisions.read_text(encoding="utf-8"))
    people = apply_revisions(fetch_credits(os.environ["WEBLATE_TOKEN"]), revisions)

    args.output.parent.mkdir(parents=True, exist_ok=True)
    args.output.write_text(
        json.dumps(people, ensure_ascii=False, indent=2) + "\n",
        encoding="utf-8",
    )
    logger.info("Wrote %d translators to %s", len(people), args.output)


if __name__ == "__main__":
    main()
