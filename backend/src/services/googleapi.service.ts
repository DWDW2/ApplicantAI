import { google } from "googleapis";

export class GoogleApiService {
    async authGoogleSheets () {
        const clientEmail = 'nfac-sheets-zhansar@nfac-hackaton.iam.gserviceaccount.com';
        const privateKey = '-----BEGIN PRIVATE KEY-----\nMIIEvQIBADANBgkqhkiG9w0BAQEFAASCBKcwggSjAgEAAoIBAQCyYAl1BBFk6Xpo\nXtD87XB1av2HpCStY3LSeHn7hwsIDZBfQ+ylCKdaH91QP5YjrdjC37E3XEt2nE9r\nhdAkUJvoekTXGxH6A6AovNR7YcMbQgH/I53Nv/6SqzRkHjKGreUbV3s4OlA/vk4+\nRjdufSwf/als5Bd6tolCYkAS81aj8Ohv84bMHoSYNsthOz01KDqbmk5mJB+yopzk\n9gJvKLK/BZNHftizq9Q6DqvolFEwnvfpVj3wK5fpvKifG/Ayd+j3j2DCStD0gjFM\nL8WakwZOIQb8O2r3PSB90MsGIBgVEHk6EoX9/PL0ipul+TCkeBG3F5BvTnpFosC2\nMe8SKtH1AgMBAAECggEAVtEiWTdJJgXzQ4A+lJQWQ7f2vMGZ7mA0XxcvO8p/BoTf\ni1Z6g9qh5V4T7/5621O+aB7K2MiNnCW5C/q9kyc+sthr0AxHZBnGpn09p+2tsgMf\nCKizohQ72fQFFGOUMPPLSlL6UKQlMdk0qN+xFBBNXSavgyXC/cGBLfO2/uI7/Z8v\ny5C9JmuAoc0uzoAeFxtKIzmN3d/qVg0VY6C0/sfXMH2xYlzkAqx/QgUg+wh19888\nwSIuCz/ZRYD24z9/bUq15ewFaq8h/1KmzIkzaRcNKIxL1TzcwSSAlewxjx+i2nHk\noVI5AAHsgU3vumv2/QH83QSe73SEiFp0kKYXVt7MIwKBgQDcnm1JjG7TfeUQVlCE\nqsWw5tt6r7oReCeJj5R/wicpZy4C4ZCUXkkgUo4Vbuuq8Oa95LK3jPyYw/4piGXA\nJUOXhdqLgxGwaeLg+8Tjwbw1Vt3X8XM3wOmBX5eWrfJJbZ8urEQbPcNO94wTf4Pk\nPIVFVhB2V7Y4M0URH71hNls7GwKBgQDO+0gnmBmrvTwNZZ/AgyaUdNO/0UEFv+J8\nu8KTjdC+lDlyU00E+mPY0opBN4Lpm0NiRKDVvPjX0ZKXudbPkG+Eq9M/adPE3TvW\njwKPfCFmtGeW3czmL3mCU5FuZE/ux8OcPORu1Yi1sfVYnXdB6JzdN4blSEuNcCyu\ne7yIZLhoLwKBgBBE+qg+2/lqwla3Fs8BzPxjufHNPbqGEtxZI0lcpwitnD4IJmJa\npafljqbT/Dsp8so0MF3K3uHhKkAj1+UYmmh1LY22R7qrxFh1GKr3IYsJcei33JhS\n+KVayFILV9/EXsXRXGBp6JpNNR5G/BH7yJQ5aZNgmoaAeWpu3cdqe8XbAoGAI2Ad\nL+82C/02w09oI14G/P6Opk0cYOAv1IO+uLtXPwtUWi7UjhJBeHBbgtP7AvQvax8x\nofY/TZubA2WWyjj0Zmd7nm327MGnFX+xv1ZG2yfgQI++EmVwzg58X7KzWqs3yn85\nx5ulVvCIb1HSbShVjxWLb6qQhybx7Axn56PXRK8CgYEAyNzChhDFZFLdRnkeyoCe\nyQLxezufQga5xUg+GnjP9iK5joLNCjxJr56i5bwOI49Y81QegnS83LPQ86995K1S\nkOb7NYjFUCrBnvx+SSlfx7/knccucF+kVfaH2suHbo1zwAbX7mZsVKRzJHqaJLr1\npCSTX0VqAFzjdysWtFfxoJ8=\n-----END PRIVATE KEY-----\n';
        

        const auth = new google.auth.JWT(
            clientEmail,
            undefined,
            privateKey.split(String.raw`\n`).join('\n'),
            'https://www.googleapis.com/auth/spreadsheets'
        );

        return auth
    }

    async getGoogleSheetsData() {
        const auth = await this.authGoogleSheets()
        const googleSheetId = '1UnpnbrYFZq-0HRd5ruhZOuWXrWQ6kByVV5qK83HprRQ';
        const googleSheetPage = 'Лист1';
        try {
            const sheetInstance = await google.sheets({ version: 'v4', auth: auth});

            const infoObjectFromSheet = await sheetInstance.spreadsheets.values.get({
                auth: auth,
                spreadsheetId: googleSheetId,
                range: `${googleSheetPage}!A1:K101`
            });
            
            const valuesFromSheet = infoObjectFromSheet.data.values;
            return valuesFromSheet
          }
          catch(err) {
            console.log("readSheet func() error", err);  
          }
    }
}