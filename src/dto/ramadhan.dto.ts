import { Contains, IsEmail, IsNotEmpty, IsNumber, IsString, Matches, Min } from "class-validator"
import { verify } from "crypto"

export class SholatDTO {
    @IsNotEmpty()
    tanggal: string; // Format YYYY-MM-DD
    subuh: boolean;
    dzuhur: boolean;
    ashar: boolean;
    maghrib: boolean;
    isya: boolean;
    tarawih: boolean;
    notes?: string;
}
export class TadarusDTO {
    @IsNotEmpty()
    tanggal: string; 
    @IsNotEmpty()
    surah: string;
    @IsNotEmpty()
    ayah: string;
    notes?: string;
}

export class PuasaDTO {
    tanggal: string; 
    notes?: string; 
  }

  export class Ceramah {
    id: number;
    date: string;
    waktu: string;
    pembicara: string;
    judul: string;
    uraian: string;
    notes?: string;
  }