import {Button, Card, CardActions, CardContent, Typography} from "@mui/material";
import dayjs, { Dayjs } from 'dayjs';
import {DatePicker, LocalizationProvider} from "@mui/x-date-pickers";
import TextField from '@mui/material/TextField';
import {AdapterDayjs} from "@mui/x-date-pickers/AdapterDayjs";
import {useRef, useState} from "react";
import styles from '@/styles/Home.module.css'
import html2canvas from "html2canvas";

const HomePage = () => {

    const [value, setValue] = useState<Dayjs | null>(dayjs());
    const cardRef = useRef<HTMLDivElement>(null);
    const [buttonVisibility, setButtonVisibility] = useState(true);

    const wait = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

    const handleClick = async () => {
        setButtonVisibility(false);
        await wait(100);
        const canvas = await html2canvas(cardRef.current!);
        const link = document.createElement("a");
        link.download = `captura-${value?.format("DD-MM-YYYY")}.png`;
        link.href = canvas.toDataURL();
        link.click();
        setButtonVisibility(true);
    };

    return(
        <>
            <Card className={styles.card} ref={cardRef} >
                <CardContent>
                    <Typography gutterBottom variant="h5" component="div" >LECTURA MEDIDORES</Typography>
                    <LocalizationProvider
                        dateAdapter={AdapterDayjs}
                    >
                        <DatePicker
                            className={styles.date}
                            inputFormat="DD/MM/YYYY"
                            label="Fecha"
                            value={value}
                            onChange={(newValue) => {
                                setValue(newValue);
                            }}
                            renderInput={(params) => <TextField {...params} />}
                        />
                    </LocalizationProvider>
                </CardContent>
                <CardActions className={styles.textInput}>
                    <TextField className={styles.dpto} label="Dpto. 201"/>
                    <TextField className={styles.dpto} label="Dpto. 202"/>
                    <TextField className={styles.dpto} label="Dpto. 301"/>
                    <TextField className={styles.dpto} label="Dpto. 302"/>
                </CardActions>
                <CardActions className={styles.button}>
                    {buttonVisibility && (
                        <Button variant="contained" onClick={handleClick}>
                            Tomar Captura
                        </Button>
                    )}
                </CardActions>
            </Card>
        </>
    )

}

export default HomePage