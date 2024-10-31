import { AppBar, Toolbar, Typography } from "@mui/material";
import React from "react";
import { useNavigate } from "react-router-dom";

const Header = ()=>{
    const navigate = useNavigate();
    return(
        <AppBar sx={{ position: "fixed" }}>
            <Toolbar>
                <Typography variant="h6" component="div" 
                onClick={()=>navigate("/")}
                sx={{ flexGrow: 1 }}>
                    Product
                </Typography>
            </Toolbar>
        </AppBar>
    )
}

export default Header;