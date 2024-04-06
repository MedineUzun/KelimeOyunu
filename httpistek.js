class httpistek {
    static async post(url, data) {
      try {
        const response = await fetch(url, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json' // Buraya dikkat edin
          },
          body: JSON.stringify(data)
         
        });
  
        if (!response.ok) {
          throw new Error('Sunucudan başarısız bir yanıt alındı');
        }
  
        return await response.json();
      } catch (error) {
        throw new Error('İstek sırasında bir hata oluştu:', error);
      }
    }
  }