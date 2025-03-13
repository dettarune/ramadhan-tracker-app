import { Injectable } from '@nestjs/common';
import { getToday } from 'src/common/common.service';
import { CeramahDTO, PuasaDTO, SholatDTO, TadarusDTO } from 'src/dto/ramadhan.dto';
import { PrismaService } from 'src/prisma/prisma.service';
import { RedisService } from 'src/redis/redis.service';

@Injectable()
export class RamadhanService {
    constructor(
            private redisServ: RedisService,
            private prismaServ: PrismaService
        ) { }

    async addSholat(userId: number, sholatData: SholatDTO){
        try {
            const today = new Date().toISOString().split('T')[0]; 

            const existingSholat = await this.prismaServ.sholat.findFirst({
                where: {
                  userId: userId,
                  date: today
                },
              });
          
              if (existingSholat) {
                throw new Error('Sholat record for today already exists');
              }
    
              return this.prismaServ.sholat.create({
                 data:{
                    date: sholatData.tanggal,
                    subuh: sholatData.subuh,
                    dzuhur: sholatData.dzuhur,
                    ashar: sholatData.ashar,
                    maghrib: sholatData.maghrib,
                    isya: sholatData.isya,
                    tarawih: sholatData.tarawih,
                    userId: userId
                 }
              })
        } catch (error) {
            console.log(error.message)
        }  
    }


    async addCeramah(userId: number, ceramahData: CeramahDTO){
        try {
            const today = new Date().toISOString().split('T')[0]; 

            const existingSholat = await this.prismaServ.sholat.findFirst({
                where: {
                  userId: userId,
                  date: today
                },
              });
          
              if (existingSholat) {
                throw new Error('Sholat record for today already exists');
              }
    
              // return this.prismaServ.ceramah.create({
              //   data: {
              //     date: ceramahData.tanggal,
              //     judul: ceramahData.judul,
              //     uraian: ceramahData.uraian,
              //     pembicara: ceramahData.pembicara,
              //     waktu: ceramahData.tanggal
              //   }
              // })

              
              return this.prismaServ.ceramah.create({
                data:{
                   date: ceramahData.tanggal,
                   pembicara: ceramahData.pembicara,
                   judul: ceramahData.judul,
                   uraian: ceramahData.uraian,
                   userId: userId
                }
             })
        } catch (error) {
            console.log(error.message)
        }  
    }


    async addTadarus(userId: number, tadarusData: TadarusDTO){
        try {
            const today = new Date().toISOString().split('T')[0]; 

            const existingSholat = await this.prismaServ.sholat.findFirst({
                where: {
                  userId: userId,
                  date: today
                },
              });
          
              if (existingSholat) {
                throw new Error('Sholat record for today already exists');
              }
    
              return this.prismaServ.tadarus.create({
                 data:{
                    date: tadarusData.tanggal,
                    surah: tadarusData.surah,
                    ayat: tadarusData.ayat,
                    userId: userId
                 }
              })
        } catch (error) {
            console.log(error.message)
        }  
    }

    async addPuasa(userId: number, puasaData: PuasaDTO){
      try {
          const today = new Date().toISOString().split('T')[0]; 

          const existingSholat = await this.prismaServ.sholat.findFirst({
              where: {
                userId: userId,
                date: today
              },
            });
        
            if (existingSholat) {
              throw new Error('Sholat record for today already exists');
            }
  
            return this.prismaServ.puasa.create({
               data:{
                  date: puasaData.tanggal,
                  isFasting: puasaData.isPuasa,
                  notes: puasaData.notes,
                  userId: userId,
               }
            })
      } catch (error) {
          console.log(error.message)
      }  
  }


}



