export interface envType  {
  database: string,
  username: string,
  password: string,
  host: string,
  dialect: string,
  pool: {
    max: number,
    min: number,
    acquire: number,
    idle: number
  }
}