import { Router } from 'express';
import { GoogleApiService } from '../services/googleapi.service';

const router = Router();
const googleApiService = new GoogleApiService();

router.get('/get', async (req, res) => {
  try {
    const data = await googleApiService.getGoogleSheetsData();
    res.json({data:data});
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Failed to retrieve data from Google Sheets' });
  }
});

export default router;
