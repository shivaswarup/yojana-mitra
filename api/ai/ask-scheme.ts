import app from '../../server';

export default function handler(req: any, res: any) {
  req.url = '/api/ai/ask-scheme';
  return app(req, res);
}
