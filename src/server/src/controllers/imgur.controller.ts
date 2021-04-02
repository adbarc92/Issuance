// Todo: Add ConsoleLogs||ConsoleDebug and ConsoleErrors to each controller endpoint; improve error definitions

import { Router, Request, Response } from 'express';
import { ImgurService } from 'services/imgur.services';
import { createErrorResponse } from 'utils';
import { UploadedFile } from 'express-fileupload';

const imgurController = (router: Router): void => {
  const imgurService = new ImgurService();

  router.post('/image', async function (req: Request, res: Response) {
    console.log('req.files:', req.files);

    if (!req.files) {
      return res.status(500).send('No files attached');
    }

    try {
      const image = req.files.file;
      // console.log('image:', image);

      const { personId } = req.body;
      const response = imgurService.postImage(image as UploadedFile, personId);
      return res.send(response);
    } catch (e) {
      res.status(500);
      return res.send(createErrorResponse(e));
    }
  });

  router.get('/image/:id', async function (req: Request, res: Response) {
    try {
      const response = imgurService.getImage(req.params.id);
      return res.send(response);
    } catch (e) {
      res.status(500);
      return res.send(createErrorResponse(e));
    }
  });
};

export default imgurController;
