# Aloita

[DataBackup](https://github.com/XayahSuSuSu/Android-DataBackup) on ilmainen ja
avoimen lähdekoodin tietojen varmuuskopiointisovellus Android-versiolle 8+.

## Root

Tämä sovellus tarvitsee root, tukee
[Magisk](https://github.com/topjohnwu/Magisk),
[KernelSU](https://github.com/tiann/KernelSU),
[APatch](https://github.com/bmax121/APatch).

## Asenna

Voit hankkia **APK:n** täältä:
* **[Julkaisut](https://github.com/XayahSuSuSu/Android-DataBackup/releases)**
* **[F-Droid](https://f-droid.org/zh_Hans/packages/com.xayah.databackup.foss/)**
* **[IzzyOnDroid](https://apt.izzysoft.de/fdroid/index/apk/com.xayah.databackup)**

On olemassa kuusi muunnelmaa:
* **foss**: Rakennettu ilman [Firebase](https://firebase.google.com/):tä.
* **premium**: Rakennettu [Firebase](https://firebase.google.com/):llä.
* **[arm64-v8a](https://developer.android.com/ndk/guides/abis#arm64-v8a)**: Tämä
  ABI on tarkoitettu 64-bittisille ARM-suorittimille, **jotka ovat useimpien
  käyttäjien ensisijainen valinta**.
* **[armeabi-v7a](https://developer.android.com/ndk/guides/abis#v7a)**: Tämä ABI
  on tarkoitettu 32-bittisille ARM-suorittimille. Se sisältää Thumb-2:n ja
  Neonin.
* **[x86](https://developer.android.com/ndk/guides/abis#x86)**: Tämä ABI on
  tarkoitettu suorittimille, jotka tukevat käskyjoukkoa, joka tunnetaan
  yleisesti nimellä "x86", "i386" tai "IA-32".
* **[x86_64](https://developer.android.com/ndk/guides/abis#86-64)**: Tämä ABI on
  tarkoitettu suorittimille, jotka tukevat yleisesti
  "x86-64"-käskykanta-aluetta. **Se on tarkoitettu PC-emulaattoria käyttäville
  käyttäjille**
