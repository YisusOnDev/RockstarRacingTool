import styled from '@emotion/styled';
import { CircularProgress } from '@mui/material';
import * as React from 'react';

const SpinnerContainer = styled.div`
    position: absolute;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
    z-index: 999999;
    background-color: rgba(0, 0, 0, 0.5);
    width: 100%;
    height: 100%;
`

const CenterSpinner = styled.div`
    display: flex;
    margin-top: 50vh;
    flex-direction: row;
    justify-content: center;
`

export const MainSpinner: React.FC = () => {
    return (
        <SpinnerContainer>
            <CenterSpinner>
                <CircularProgress />
            </CenterSpinner>
        </SpinnerContainer>
    );
}
