import express, { Request, Response } from 'express';
import * as listingController from '../controllers/listing.controller';

const router = express.Router();

// GET all listings
router.get('/', (req: Request, res: Response) => {
  listingController.getAllListings(req, res);
});

// GET listing by ID
router.get('/:id', (req: Request, res: Response) => {
  res.status(200).json({ message: `Get listing ${req.params.id} - Endpoint to be implemented` });
});

// POST new listing
router.post('/', (req: Request, res: Response) => {
  listingController.createListing(req, res);
});

// PUT update listing
router.put('/:id', (req: Request, res: Response) => {
  res.status(200).json({ message: `Update listing ${req.params.id} - Endpoint to be implemented` });
});

// DELETE listing
router.delete('/:id', (req: Request, res: Response) => {
  res.status(200).json({ message: `Delete listing ${req.params.id} - Endpoint to be implemented` });
});

export default router;