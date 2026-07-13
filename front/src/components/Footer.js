import React from "react";
import { Grid, Typography } from '@material-ui/core';
import './Footer.css';
import Socialicons from './Socialicons';



const Footer = () => {
 

  return (
    <div className='footer-div'>
      <Grid container>
        <Grid item xs={12}>
        <Socialicons />
        </Grid>
        <Grid item xs={12} >
          <div className='projects-div'>
            <Typography variant="subtitle1" className='title'>Projects being done</Typography>
            <Typography variant="subtitle1">Kegeberew E-Comerce</Typography>
            <Typography variant="subtitle1">Kegeberew University</Typography>
            <Typography variant="subtitle1">KTS</Typography>
            <Typography variant="subtitle1">Kegeberew Tv</Typography>
          </div>
          <div className='contact-us-div'>
            <Typography variant="subtitle1" className='title'>Contact Us</Typography>
            <Typography variant="subtitle1">9858</Typography>
            <Typography variant="subtitle1">kegeberew.com</Typography>
            
            <Typography variant="subtitle1">Adiss Abeba, Ethiopia</Typography>
          </div>
          <div className='copyright-div'>
            <Typography variant="subtitle1" className="title">Copy right</Typography>
            <Typography variant="subtitle1">Purpose Blak Ethiopia</Typography>
          </div>
        </Grid>
      </Grid>
    </div>
  );
};

export default Footer;
