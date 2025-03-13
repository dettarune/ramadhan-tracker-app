import { Contains, IsEmail, IsNotEmpty, IsNumber, IsString, Matches, Min } from "class-validator"
import { verify } from "crypto"

export class SholatDTO {
    @IsNotEmpty()
    tanggal: string; // Format YYYY-MM-DD
    @IsNotEmpty()
    subuh: boolean;
    @IsNotEmpty()
    dzuhur: boolean;
    @IsNotEmpty()
    ashar: boolean;
    @IsNotEmpty()
    maghrib: boolean;
    @IsNotEmpty()
    isya: boolean;
    @IsNotEmpty()
    tarawih: boolean;
    notes?: string;
}
export class TadarusDTO {
    @IsNotEmpty()
    tanggal: string; 
    @IsNotEmpty()
    surah: string;
    @IsNotEmpty()
    ayat: string;
    notes?: string;
}

export class PuasaDTO {
    @IsNotEmpty()
    tanggal: string; 
    @IsNotEmpty()
    isPuasa: boolean
    @IsNotEmpty()
    notes: string; 
  }

  export class CeramahDTO {
    @IsNotEmpty()
    tanggal: string;
    @IsNotEmpty()
    pembicara: string;
    @IsNotEmpty()
    judul: string;
    @IsNotEmpty()
    uraian: string;
    notes?: string;
  }