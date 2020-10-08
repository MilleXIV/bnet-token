import { AzureFunction, Context, HttpRequest } from "@azure/functions";
import fetch, { Response } from 'node-fetch';
import { URLSearchParams } from 'url';

type TokenResponse = {
	access_token: string,
	token_type: string,
	expires_in: number,
	scope: string
};

const httpTrigger: AzureFunction = async function (context: Context, req: HttpRequest): Promise<void> {
	let authCode: string = req.query.code || req.body || '';
	if (authCode === '') {
		context.res = {
			body: JSON.stringify({ error: 'Code is required' }),
			code: 400,
		};
		return Promise.resolve();
	}

	if (authCode.startsWith('code')) {
		authCode = (new URLSearchParams(authCode)).get('code');
	}

	const reqData = {
		redirect_uri: process.env.REDIRECT,
		scope: process.env.SCOPE,
		grant_type: 'authorization_code',
		code: authCode,
	};

	try {
		const params: URLSearchParams = new URLSearchParams(reqData);
		const login: string = Buffer.from(`${process.env.CLIENT_ID}:${process.env.CLIENT_SECRET}`).toString('base64');
		const fetchParams: object = {
			method: 'POST',
			body: params,
			headers: {
				Authorization: `Basic ${login}`
			}
		};
		context.log(fetchParams);
		const res: Response = await fetch(process.env.TOKEN_URL, fetchParams);
		const json: object = await res.json();
		context.res.body = JSON.stringify(json as TokenResponse);
	} catch (e) {
		context.res = {
			code: e.response.code,
			body: JSON.stringify({ error: await e.response.text() })
		};
	}
};

export default httpTrigger;