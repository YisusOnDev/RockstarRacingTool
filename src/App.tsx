import { useState } from "react";
import reactLogo from "./assets/react.svg";
// import { invoke } from "@tauri-apps/api/tauri";
import { open, message, save } from '@tauri-apps/api/dialog';
import { readTextFile, writeFile } from "@tauri-apps/api/fs";
import "./App.css";
import ConvertJson, { Race } from "./utils/ConvertJson";
import CircularProgress from "@mui/material/CircularProgress";

function App() {
  const [spinner, setSpinner] = useState(false);

  async function loadJsonFile() {
    // Learn more about Tauri commands at https://tauri.app/v1/guides/features/command
    //setGreetMsg(await invoke("greet", { name }));
    const filePath: string | string[] | null = await open({
      multiple: false,
      filters: [{
        name: 'JSON',
        extensions: ['json']
      }]
    })

    if (filePath === null) return;

    setSpinner(true);

    const fileContent: string | void = await readTextFile(filePath as string);
    const jsonFile: JSON | any = JSON.parse(fileContent);
    const savePath = await save({
      filters: [{
        name: 'JSON',
        extensions: ['json']
      }]
    });

    if (savePath === null) {
      message('No has puesto el nombre del fichero convertido');
      return;
    }

    const converted: Race | undefined = ConvertJson(jsonFile);
    const savedFile: any = writeFile(savePath as string, JSON.stringify(converted));
    setSpinner(false);
    message('Conversión completada!')
  }

  return (
    <div className="container">
      <h1>Oasis Rockstar Racing Tool</h1>

      <div className="row">
        Selecciona un archivo JSON de Rockstar para convertirlo
      </div>

      <div className="row">
        <div>
          <CircularProgress style={{ display: spinner ? 'block' : 'none' }} />
          <button style={{ display: !spinner ? 'block' : 'none' }} type="button" onClick={() => loadJsonFile()}>
            Convertir JSON
          </button>
        </div>
      </div>
    </div>
  );
}

export default App;
