# BSM
*Authors: Patryk Wylegała*

A project created for the Mobile Systems Security course

## Secure Storage

### Android

* A random 256-bit AES key is generated
* The AES key encrypts the value
* The AES key is encrypted with a device-generated RSA (RSA/ECB/PKCS1Padding) from the Android KeyStore
* The combination of the encrypted AES key and value are stored in ``SharedPreferences``

The inverse process is followed on ``get``

Native AES is used when available, otherwise encryption is provided by the [sjcl](https://github.com/bitwiseshiftleft/sjcl) library. API level 19 (Android 4.4 KitKat) is required on Android

>*Language: TypeScript (ionic)* <br>
>*Semester: Winter* <br>
>*Year: 2017*