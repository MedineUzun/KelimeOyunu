const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const app = express();

app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());


const girisdeneme = mongoose.model('denemes', {
    kullaniciadi: String,
    sifre: String ,
    kelime: String
});
;

app.post('/uyeol', async (req, res) => {

    const yeniUye = new girisdeneme({
        kullaniciadi: 'zehra',
        sifre: 'z123'
    });

    yeniUye.save()
    .then(() => {
        console.log('Yeni kullanıcı başarıyla kaydedildi.');
        res.send('Yeni kullanıcı başarıyla kaydedildi.');
    })
    .catch((err) => {
        console.error('Kullanıcı kaydedilirken bir hata oluştu:', err);
        res.status(500).send('Kullanıcı kaydedilirken bir hata oluştu.');
    });
});

app.post('/girisyap', async (req, res) => {
    const { kullaniciadi, sifre } = req.body;

    try {
    
        const kullaniciveri = await girisdeneme.find({}).select('kullaniciadi sifre');
       // console.log(kullaniciveri)
        if (!kullaniciveri) {
           return res.status(400).send("Kullanıcı adı veya şifre hatalı");
        } 
        
        res.json({ kullaniciadi: kullaniciveri.kullaniciadi });
    } catch (err) {
        console.error('Veri alınırken bir hata oluştu:', err);
        res.status(500).json({ hata: 'Veri alınırken bir hata oluştu' });
    }
});


app.post('/kelimegir', async (req, res) => {

    const kullaniciveri = await girisdeneme.findOne({}).sort({ $natural: -1 }).select('kullaniciadi sifre kelime ');
   
    const yeniKelime = new girisdeneme({
        kullaniciadi: kullaniciveri.kullaniciadi,
        sifre: kullaniciveri.sifre,
        kelime: 'zehir'
    
    });

    yeniKelime .save()
    .then(() => {
        console.log('Yeni kelime başarıyla kaydedildi.');
        res.send('Yeni kelime başarıyla kaydedildi.');
    })
    .catch((err) => {
        console.error('Kelime kaydedilirken bir hata oluştu:', err);
        res.status(500).send('Kelime kaydedilirken bir hata oluştu.');
    });

    const kelimeUzunlugu = kullaniciveri.kelime.length;
    const aranan = [];
    const girilen = [];
    //girilen kelime
    const bb = "zekar";
     for (let i = 0; i <kelimeUzunlugu; i++) {
          aranan.push(kullaniciveri.kelime[i]);
         
     } 
     // console.log(aranan);
     for (let i = 0; i <kelimeUzunlugu; i++) {
        girilen.push(bb[i]); 
        if (girilen[i] === aranan[i]) {
            console.log("Eşleşen karakterler:", girilen[i], " index:", i);
        }
     }
     
     //console.log(girilen); 
});

mongoose.connect("mongodb+srv://medineeuzunn:OjZmCJz6bP958nZ0@cluster0.yc9jtyd.mongodb.net/kelimeoyunu")
    .then(() => {
        console.log('MongoDB bağlantısı başarılı.');
        app.listen(3000, () => console.log('Sunucu çalışıyor...'));
    })
    .catch((err) => {
        console.error('MongoDB bağlantısı kurulurken hata oluştu:', err);
    });
