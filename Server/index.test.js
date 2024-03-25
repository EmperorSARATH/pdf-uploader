const axios = require('axios');

describe('API Endpoint Tests', () => {

  it('should return status 200', async () => {
    const response = await axios.get(`http://localhost:5000/upload/page?name=new_pdf`);

    expect(response.status).toBe(200);
  });
});


describe('POST API Endpoint Test', () => {
  it('should return status 200', async () => {
    const body = {
      name: 'roadmap_to_sucess.pdf',
      page_no: '1'
    };
    const response = await axios.post('http://localhost:5000/upload/page', body);
    expect(response.status).toBe(200);
   
  });
});



