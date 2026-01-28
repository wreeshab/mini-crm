import { Injectable } from '@nestjs/common';

@Injectable()
export class AppService {
  getHello(): string {
    return `
    <!DOCTYPE html>
    <html>
      <head>
        <title>Mini CRM API</title>
        <style>
          body {
            font-family: Arial, sans-serif;
            display: flex;
            justify-content: center;
            align-items: center;
            height: 100vh;
            margin: 0;
            background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
          }
          .container {
            text-align: center;
            background: white;
            padding: 3rem;
            border-radius: 10px;
            box-shadow: 0 10px 40px rgba(0,0,0,0.2);
          }
          h1 { color: #333; margin-bottom: 1rem; }
          p { color: #666; margin-bottom: 2rem; }
          button {
            background: #667eea;
            color: white;
            border: none;
            padding: 12px 30px;
            font-size: 16px;
            border-radius: 5px;
            cursor: pointer;
            transition: background 0.3s;
          }
          button:hover {
            background: #764ba2;
          }
        </style>
      </head>
      <body>
        <div class="container">
          <h1>Welcome to Mini CRM API</h1>
          <p>Click below to view the API documentation</p>
          <button onclick="window.location.href='/api/docs'">
            View API Documentation
          </button>
        </div>
      </body>
    </html>
    `;
  }
}
