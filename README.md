# BSM
*Authors: Patryk Wylegała*

A project created for the 'Mobile Systems Security' course (Bezpieczeństwo systemów mobilnych - BSM)

## Table of contents

- [Secure Storage](#secure-storage)
  - [Android](#android)
- [Support](#support)
- [App information](#app-information)

## Secure Storage

### Android

* A random 256-bit AES key is generated
* The AES key encrypts the value
* The AES key is encrypted with a device-generated RSA (RSA/ECB/PKCS1Padding) from the Android KeyStore
* The combination of the encrypted AES key and value are stored in ``SharedPreferences``

The inverse process is followed on ``get``

Native AES is used when available, otherwise encryption is provided by the [sjcl](https://github.com/bitwiseshiftleft/sjcl) library. API level 19 (Android 4.4 KitKat) is required on Android

## Support

Contact me via email

> **pat.wylegala@gmail.com**

## App information

**Language**: _TypeScript (ionic)_

**Semester**: _Winter_

**Year**: _2017_
