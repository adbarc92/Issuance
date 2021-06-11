// Todo: add encryption to access_token

import { getConnection, Repository } from 'typeorm';
import axios, { AxiosResponse } from 'axios';
// import dotenv from 'dotenv';
import FormData from 'form-data';

import { ImgurTokenEntity } from 'entity/ImgurToken';

import { PersonService } from 'services/personnel.services';
import { tokenIsExpired } from 'utils';
import { UploadedFile } from 'express-fileupload';

// const configureDotEnv = () => {
//   const result = dotenv.config();

//   if (result.error) {
//     throw result.error;
//   }

//   return result;
// };

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
  imgurRepository: Repository<ImgurTokenEntity>;

  constructor() {
    this.imgurRepository = getConnection().getRepository(ImgurTokenEntity);
    // configureDotEnv();
  }

  async getAccessToken(): Promise<ImgurTokenEntity> {
    let token = await this.imgurRepository.findOne();

    if (!token || tokenIsExpired(token)) {
      try {
        const url = 'https://api.imgur.com/oauth2/token';

        const data = JSON.stringify({
          refresh_token: process.env.REFRESH_TOKEN,
          client_id: process.env.CLIENT_ID,
          client_secret: process.env.CLIENT_SECRET,
          grant_type: 'refresh_token',
        });

        const res: AxiosResponse<ImgurTokenResponse> = await axios.post(
          url,
          data,
          {
            headers: { 'content-type': 'application/json' },
          }
        );

        const { access_token, expires_in } = res.data;

        const d = new Date();
        d.setSeconds(d.getSeconds() + expires_in);

        token = this.imgurRepository.create({
          token: access_token,
          expires_at: d,
        });
        console.log('repoToken:', token);
      } catch (e) {
        if (e.isAxiosError) {
          console.error(
            'Failed to get access token',
            e.config.method,
            e.config.url
          );
          console.error(JSON.stringify(e.response.data, null, 2));
        } else {
          console.error('Failed to get access token', e);
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
      const postUrl = 'https://api.imgur.com/3/upload';

      const data = new FormData();

      data.append('image', image.data.toString('base64'));
      data.append('type', 'base64');

      const { token } = await this.getAccessToken();

      const response: AxiosResponse<ImgurImageUploadResponse> = await axios.post(
        postUrl,
        data,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            ...data.getHeaders(),
          },
        }
      );
      // * If an Axios request rejects within an async, it skips to the catch

      const profile_picture = response.data.data.link;

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
      // const form = new FormData();

      const url = `https://api.imgur.com/3/image/${imageId}`;

      const response: AxiosResponse<ImgurImageDownloadResponse> = await axios.get(
        url,
        // form,
        {
          headers: {
            Authorization: `Bearer ${accessToken}`,
          },
        }
      );

      return response.data.data.link;
    } catch (e) {
      console.error(e);
    }
  }
}
