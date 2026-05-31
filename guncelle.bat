           @echo off
           color 0B
           echo ==========================================
           echo 🚀 SEFIM, KODLAR GITHUB'A UCURULUYOR...
           echo ==========================================
           echo.

           git add .
           git commit -m "Sefimden hizli guncelleme"
           git push

           echo.
           echo ==========================================
           echo ✅ ISLEM KUSURSUZ TAMAMLANDI!
           echo ==========================================
           timeout /t 3 >nul
           pause