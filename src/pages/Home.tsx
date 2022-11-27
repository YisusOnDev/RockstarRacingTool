import styled from '@emotion/styled'
import { Button, SxProps } from '@mui/material'
import React from 'react'
import bgImg from '../assets/bg.jpg'
import oasisLogo from '../assets/weblogo.png'
import { InputUrlDialog } from '../components/InputUrlDialog'

const BackgroundContainer = styled.div`
    display: flex;
    flex-direction: row;
    justify-content: center;
    background-image: url(${bgImg});
    background-position: center;
    background-repeat: no-repeat;
    background-size: auto;
    height: 100vh;
`
const MiddleContinaer = styled.div`
    display: flex;
    flex-direction: column;
    justify-content: center;
`
const MiddleRow = styled.div`
    display: flex;
    flex-direction: row;
    justify-content: space-between;
`
const OasisLogo = styled.img`
    width: auto;
    height: 400px;
`

const homeButton: SxProps = {
    '&:hover': {
        border: '1px solid #ce8aff',
        backgroundColor: '#561188'
    },

    backgroundColor: '#7817be',
    border: '1px solid transparent',
    color: 'white'
}



export const Home = () => {
    const [convertDialogOpened, setDialogOpen] = React.useState(false);

    const convertJsonButtonPressed = () => {
        setDialogOpen(true);
    }

    return (
        <>
            <BackgroundContainer>
                <MiddleContinaer>
                    <OasisLogo src={oasisLogo} />
                    <MiddleRow>
                        <Button sx={homeButton} onClick={convertJsonButtonPressed} >Convertir JSON</Button>
                        {convertDialogOpened ? <InputUrlDialog handler={setDialogOpen} /> : null} 
                        <Button sx={homeButton}>Editar JSON</Button>
                    </MiddleRow>
                </MiddleContinaer>
            </BackgroundContainer>
        </>
    )
}
