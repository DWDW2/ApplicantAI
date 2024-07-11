import { Router } from 'express';
import { GoogleApiService } from '../services/googleapi.service';
import GoogleSheetsController from '../controllers/googleapi.controller';
import { hasFilesMiddleware } from '../middleare/json.middleware';
import multer from 'multer';

const upload = multer();

const router = Router();
const googleApiService = new GoogleApiService();
const googleSheetsController = new GoogleSheetsController(googleApiService);

router.get('/get', hasFilesMiddleware, (req, res) => googleSheetsController.getSheetData(req, res))

router.post('/upload-json', upload.single('file'), (req, res) => googleSheetsController.uploadJson(req, res))

router.post('/upload-json', upload.single('file'), (req, res) => googleSheetsController.uploadJson(req, res))

router.get('/get-ai-check', hasFilesMiddleware, (req, res) => googleSheetsController.chechWithAiGoogleSheets(req, res))

export default router;
