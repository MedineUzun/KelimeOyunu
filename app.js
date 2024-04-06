const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const httpistek = require('./httpistek');
const app = express();

app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());


const girisdeneme = mongoose.model('denemes', {
    kullaniciadi: String,
    sifre: String ,
    kelime: String,
    kanal :String,
    skor: String
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


app.post('/uyeol', async (req, res) => {

    const { kullaniciadi, sifre } = req.body;

  try {
    const yeniKullanici = new girisdeneme({ kullaniciadi, sifre });
    await yeniKullanici.save();

    console.log('Yeni kullanıcı başarıyla kaydedildi:', kullaniciadi);
    res.status(200).json({ message: 'Yeni kullanıcı başarıyla kaydedildi.' });
  } catch (err) {
    console.error('Kullanıcı kaydedilirken bir hata oluştu:', err);
    res.status(500).json({ error: 'Kullanıcı kaydedilirken bir hata oluştu.' });
  }
    
 
});

app.post('/kanal', async (req, res) => {
  const  kanal = req.body;
  const kullaniciveri = await girisdeneme.findOne({}).sort({ $natural: -1 }).select('kullaniciadi sifre  kanal');
  
    try {
    const yeniKanal = new girisdeneme({
        kullaniciadi: kullaniciveri.kullaniciadi,
        sifre: kullaniciveri.sifre,
        kanal : kanal.kanal,

       });
        await yeniKanal.save();
        console.log('Tıklanan buton:', kanal);
    res.status(200).json({ message: 'Yeni kanal başarıyla kaydedildi.', kanal });
    } catch (err) {
   console.error('Yeni kanal kaydedilirken bir hata oluştu:', err);
   res.status(500).json({ error: 'Kanal kaydedilirken bir hata oluştu.' });
  }

});



app.post('/kelimegir', async (req, res) => {
    try {
        const kelime  = req.body;
        const kullaniciveri = await girisdeneme.findOne({}).sort({ $natural: -1 }).select('kullaniciadi sifre  kanal kelime');
        
        const yeniKelime = new girisdeneme({  
            kullaniciadi: kullaniciveri.kullaniciadi,
            sifre: kullaniciveri.sifre,
            kanal: kullaniciveri.kanal,
            kelime: kelime.kelime
        });

        await yeniKelime.save();

        console.log('Yeni kelime başarıyla kaydedildi.');
        res.send('Yeni kelime başarıyla kaydedildi.');
    } catch (err) {
        console.error('Kelime kaydedilirken bir hata oluştu:', err);
        res.status(500).send('Kelime kaydedilirken bir hata oluştu.');
    }
});


app.post('/aktif', async (req, res) => {
    const kanal = req.body.kanal;
    
    const kullaniciveri = await girisdeneme.find({ 
        kullaniciadi: { $exists: true },
        sifre: { $exists: true },
        kanal: { $exists: true },
        kelime: { $exists: false }
    }).select('kullaniciadi sifre kanal kelime');
    
    let ayniKanalaSahipKullanicilar = [];
    kullaniciveri.forEach((kullanici) => {
        if (kanal === kullanici.kanal) {
            ayniKanalaSahipKullanicilar.push(kullanici.kullaniciadi);
        }
    });

    if (ayniKanalaSahipKullanicilar.length > 0) {
        console.log("Aynı kanalda olan kullanıcılar: " + ayniKanalaSahipKullanicilar.join(", "));
        res.status(200).json({ kullaniciadi: ayniKanalaSahipKullanicilar });
    } else {
        console.log("Aynı kanalda bulunan kullanıcı yok");
        res.status(404).json({ message: 'Aynı kanalda bulunan kullanıcı yok.' });
    }
  

});



mongoose.connect("mongodb+srv://medineeuzunn:OjZmCJz6bP958nZ0@cluster0.yc9jtyd.mongodb.net/kelimeoyunu")
    .then(() => {
        console.log('MongoDB bağlantısı başarılı.');
        app.listen(3000, () => console.log('Sunucu çalışıyor...'));
    })
    .catch((err) => {
        console.error('MongoDB bağlantısı kurulurken hata oluştu:', err);
    });
