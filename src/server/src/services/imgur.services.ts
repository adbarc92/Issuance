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

export interface ImgurImageUploadData {
  id: string;
  deletehash: string;
  account_id: number;
  account_url: string;
  ad_type: null | string;
  ad_url: null | string;
  title: string;
  description: string;
  name: string;
  type: string;
  width: number;
  height: number;
  size: number;
  views: number;
  section: null | string;
  vote: null | string;
  bandwidth: number;
  animated: boolean;
  favorite: boolean;
  in_gallery: boolean;
  in_most_viral: boolean;
  has_sound: boolean;
  is_ad: boolean;
  nsfw: null | string;
  link: string;
  tags: string[];
  datetime: number;
  mp4: string;
  hls: string;
}

export interface ImgurImageUploadResponse {
  status: number;
  success: boolean;
  data: ImgurImageUploadData;
}

export interface ImgurImageDownloadData {
  id: string;
  title: string;
  description: string;
  datetime: number;
  type: string;
  animated: boolean;
  width: number;
  height: number;
  size: number;
  views: number;
  bandwidth: number;
  vote: null | string;
  favorite: boolean;
  nsfw: boolean;
  section: null | string;
  account_url: null | string;
  account_id: null | string;
  is_ad: boolean;
  in_most_viral: boolean;
  has_sound: boolean;
  tags: string[];
  ad_type: number;
  ad_url: string;
  edited: string;
  in_gallery: boolean;
  link: string;
  ad_config: {
    safeFlags: string[];
    highRiskFlags: string[];
    unsafeFlags: string[];
    wallUnsafeFlags: string[];
    showsAds: boolean;
  };
}

export interface ImgurImageDownloadResponse {
  status: number;
  success: boolean;
  data: ImgurImageDownloadData;
}

export class ImgurService {
  imgurRepository: Repository<ImgurToken>;

  constructor() {
    this.imgurRepository = getConnection().getRepository(ImgurToken);
  }

  // Todo: undo nested tries
  async getAccessToken(): Promise<ImgurToken> {
    let token = await this.imgurRepository.findOne(); // * What

    if (!token || tokenIsExpired(token)) {
      try {
        const data = JSON.stringify({
          refresh_token: process.env.REFRESH_TOKEN,
          client_id: process.env.CLIENT_ID,
          client_secret: process.env.CLIENT_SECRET,
          grant_type: 'refresh_token',
        });
        console.log('data:', data);

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
        if (e.isAxiosError) {
          console.error(
            'Failed to upload image',
            e.config.method,
            e.config.url
          );
          console.error(JSON.stringify(e.response.data, null, 2));
        } else {
          console.error('Failed to upload image', e);
        }
      }
    }

    return token;
  }

  async postImage(
    image: UploadedFile,
    personId: string
  ): Promise<string | null> {
    try {
      const data = new FormData();

      data.append('image', image.data.toString('base64')); // Todo: toy with this
      data.append('type', 'base64');

      const accessToken = this.getAccessToken();

      const response: AxiosResponse<ImgurImageUploadResponse> = await axios.post(
        'https://api.imgur.com/3/upload',
        {
          headers: {
            Authorization: `Bearer ${accessToken}`,
            ...data.getHeaders(), // undefined if default formData
          },
          data,
        }
      );
      // * If an Axios request rejects within an async, it skips to the catch

      const profile_picture = response.data.data.id;

      const personService = new PersonService();
      personService.modifyPerson({ id: personId, profile_picture });
      return JSON.stringify(response.data);
    } catch (e) {
      if (e.isAxiosError) {
        console.error('Failed to upload image', e.config.method, e.config.url);
        console.error(JSON.stringify(e.response.data, null, 2));
      } else {
        console.error('Failed to upload image', e);
      }
    }
  }

  async getImage(imageId: string): Promise<string | null> {
    try {
      const accessToken = this.getAccessToken();
      const data = new FormData();

      const response: AxiosResponse<ImgurImageDownloadResponse> = await axios.get(
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
