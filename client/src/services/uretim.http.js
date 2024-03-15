/* eslint-disable import/prefer-default-export */
import CRUDServerHttp from "./crud-server.http";

export const devamEdenUretimHttp = new CRUDServerHttp("/uretim/devam-eden", "id");
export const tamamlananUretimHttp = new CRUDServerHttp("/uretim/tamamlanan", "id");
