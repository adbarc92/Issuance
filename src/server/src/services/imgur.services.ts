// Todo: add encryption to access_token

import { getConnection, Repository } from 'typeorm';
import axios, { AxiosResponse } from 'axios';
import dotenv from 'dotenv';
import FormData from 'form-data';
import fs from 'fs';

import { ImgurToken } from 'entity/ImgurToken';

import { PersonService } from 'services/personnel.services';
import { tokenIsExpired } from 'utils';
import { UploadedFile } from 'express-fileupload';

dotenv.config();

export interface ImgurTokenResponse {
  access_token: string;
  expires_in: number;
  token_type: string;
  scope: string;
  refresh_token: string;
  account_id: number;
  account_username: string;
}

export class ImgurService {
  imgurRepository: Repository<ImgurToken>;

  constructor() {
    this.imgurRepository = getConnection().getRepository(ImgurToken);
  }

  async getAccessToken(): Promise<ImgurToken> {
    let token = await this.imgurRepository.findOne();

    if (!token || tokenIsExpired(token)) {
      try {
        const data = JSON.stringify({
          refresh_token: process.env.REFRESH_TOKEN,
          client_id: process.env.CLIENT_ID,
          client_secret: process.env.CLIENT_SECRET,
          grant_type: 'refresh_token',
        });

        const res: AxiosResponse<ImgurTokenResponse> = await axios.post(
          'https://api.imgur.com/oauth2/token',
          {
            headers: { 'Content-Type': 'application/json' },
            data,
          }
        );

        const { access_token, expires_in } = res.data;

        const d = new Date();
        d.setSeconds(d.getSeconds() + expires_in);

        token = this.imgurRepository.create({
          token: access_token,
          expires_at: d,
        });
      } catch (e) {
        console.error(e);
      }
    }

    return token;
  }

  async postImage(
    image: UploadedFile,
    name: string,
    personId: string
  ): Promise<any> {
    console.log('image:', image);
    console.log('name:', name);
    console.log('personId:', personId);

    try {
      const data = new FormData();

      console.log('data1:', data);
      console.log('image:', image);

      // data.append('image', JSON.stringify(image));
      // data.append('image', fs.createReadStream(image));

      console.log('data2:', data);
      data.append('image', image, name);
      console.log('data3:', data);
      // data.append('title', name);
      // console.log('data4:', data);

      const accessToken = this.getAccessToken();

      const response = await axios.post('https://api.imgur.com/3/upload', {
        headers: {
          Authorization: `Bearer ${accessToken}`,
          ...data.getHeaders(), // undefined if default formData
        },
        data,
      });

      const profile_picture = response.data.id;

      const personService = new PersonService();
      personService.modifyPerson({ id: personId, profile_picture });
      return JSON.stringify(response.data);
    } catch (e) {
      console.error(e);
    }
  }

  async getImage(imageId: string): Promise<any | null> {
    try {
      const accessToken = this.getAccessToken();
      const data = new FormData();

      const response = await axios.get(
        `https://api.imgur.com/3/image/${imageId}`,
        {
          headers: {
            Authorization: `Bearer ${accessToken}`,
            ...data.getHeaders(),
          },
          data,
        }
      );

      return response.data.data.link;
    } catch (e) {
      console.error(e);
    }
  }
}
