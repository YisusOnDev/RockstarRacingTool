import { Box, Chip, FormControl, InputLabel, MenuItem, OutlinedInput, Select, SelectChangeEvent, Theme, useTheme } from '@mui/material';
import Button from '@mui/material/Button';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogContentText from '@mui/material/DialogContentText';
import DialogTitle from '@mui/material/DialogTitle';
import * as React from 'react';

interface DialogProps {
    handler: Function,
    cb: Function
}

const ITEM_HEIGHT = 48;
const ITEM_PADDING_TOP = 8;
const MenuProps = {
    PaperProps: {
        style: {
            maxHeight: ITEM_HEIGHT * 4.5 + ITEM_PADDING_TOP,
            width: 250,
        },
    },
};

const RaceCategories = [
    'Acrobatica',
    'GP',
    'Acuatica',
    'Formula',
    'Cara a Cara',
    'Megarampa',
    'Parkour',
    'Rally',
    'Aerea',
    'Transformación',
    'Wallride',
    'Level Asian'
];

function getStyles(name: string, categoryName: readonly string[], theme: Theme) {
    return {
        fontWeight:
            categoryName.indexOf(name) === -1
                ? theme.typography.fontWeightRegular
                : theme.typography.fontWeightMedium,
    };
}


export const SaveConvertedJson: React.FC<DialogProps> = ({ handler, cb }) => {
    const theme = useTheme();
    const [selectedCategories, setSelectedCategories] = React.useState<string[]>([]);

    const handleCategoriesChange = (event: SelectChangeEvent<typeof selectedCategories>) => {
        const {
            target: { value },
        } = event;
        setSelectedCategories(
            // On autofill we get a stringified value.
            typeof value === 'string' ? value.split(',') : value,
        );
    };

    const handleClose = () => {
        handler(false);
        cb(null);
    };

    const handleConfirm = () => {
        handler(false);
        cb(selectedCategories);
    }

    return (
        <div>
            <Dialog open={true} onClose={handleClose}>
                <DialogTitle>Personalizar Carrera</DialogTitle>
                <DialogContent>
                    <DialogContentText>
                        Añade las categorias a la que la carrera pertenece y obten tu JSON final.
                    </DialogContentText>
                    <FormControl sx={{ m: 1, width: 300 }}>
                        <InputLabel id="demo-multiple-chip-label">Categorías</InputLabel>
                        <Select
                            fullWidth={true}
                            labelId="demo-multiple-chip-label"
                            id="demo-multiple-chip"
                            multiple
                            value={selectedCategories}
                            onChange={handleCategoriesChange}
                            input={<OutlinedInput id="select-multiple-chip" label="Chip" />}
                            renderValue={(selected) => (
                                <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5 }}>
                                    {selected.map((value) => (
                                        <Chip key={value} label={value} />
                                    ))}
                                </Box>
                            )}
                            MenuProps={MenuProps}
                        >
                            {RaceCategories.map((name) => (
                                <MenuItem
                                    key={name}
                                    value={name}
                                    style={getStyles(name, selectedCategories, theme)}
                                >
                                    {name}
                                </MenuItem>
                            ))}
                        </Select>
                    </FormControl>
                </DialogContent>
                <DialogActions>
                    <Button onClick={handleClose}>Cancelar</Button>
                    <Button onClick={handleConfirm}>Confirmar</Button>
                </DialogActions>
            </Dialog>
        </div>
    );
}
