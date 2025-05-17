import React from 'react';
import qrCode from '../assets/Pasted image.png';
import { Box, Typography, Link } from '@mui/material';
export default function TelegramQR(){
    return (
        <Box
        sx={{
            p: 2,
            bgcolor: 'background.default',
            maxWidth: 1200,
            margin: '2rem auto',
            borderRadius: 2,
            boxShadow: 3,
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            textAlign: 'center',
        }}
        >
        <img
            src={qrCode}
            alt="QR Code"
            style={{
            width: 200,
            height: 200,
            objectFit: 'contain',
            marginBottom: 16,
            }}
        />
        <Link
            href="https://t.me/HermesNUBot"
            target="_blank"
            rel="noopener noreferrer"
            underline="none"
            sx={{
            fontWeight: 700,
            fontSize: '1.25rem',
            color: '#e53935',
            '&:hover': {
                color: '#b71c1c',
                textDecoration: 'underline',
            },
            }}
        >
            Link to the Telegram Bot
        </Link>
        </Box>

    );
}
