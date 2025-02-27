interface SheetsType {
    data: any[][]
}
interface authGoogleSheet {
    type: string,
  project_id: string,
  private_key_id: string,
  client_email: string,
  private_key: string,
  client_id: string,
  auth_uri: string,
  token_uri: string,
  auth_provider_x509_cert_url: string,
  client_x509_cert_url:string,
  universe_domain: string,
}

type ResultObject = {
  [key: string]: string;
};
export  {SheetsType, authGoogleSheet, ResultObject}