import {Card, CardContent, Checkbox, FormControlLabel, Typography} from "@material-ui/core";
import Accordion from "@material-ui/core/Accordion";
import AccordionSummary from "@material-ui/core/AccordionSummary";
import ExpandMoreIcon from "@material-ui/icons/ExpandMore";
import AccordionDetails from "@material-ui/core/AccordionDetails";
import {SkeletonData} from "../../model/skeleton-data";
import React, {useContext} from "react";
import {useGlobalStyles} from "../../../App";
import {SettingsContext} from "../../context/settings-context";
import {SaveLoadSettingsPanel} from "./save-load-settings-panel";
import {EditorSettings} from "../../model/editor-settings-data";
import {QuadratsContext} from "../../context/quadrats-context";
import {EditorModesSettingsPanel} from "./editor-modes-panel";
import {PlaybackPanel} from "./playback-panel";


export const EditorSettingsPanel = () => {
    const {settings, updateSettings} = useContext(SettingsContext);
    const {quads, updateQuads} = useContext(QuadratsContext);

    const classes = useGlobalStyles();

    const partialUpdateSettings = (value: Partial<EditorSettings>) => {
        updateSettings({...settings, ...value})
    }

    let fileReader;



    const handleSaveFileRead = (e) => {
        const stringifiedData = fileReader.result;
        console.log(stringifiedData)
        const memorizedScheme = stringifiedData ? JSON.parse(stringifiedData) : [];
        let validatedBlockScheme = memorizedScheme.map(maybeQuad => {
            return SkeletonData.createFromDeserialized(maybeQuad);
        });
        updateQuads(validatedBlockScheme)
    }

    const handleSaveFileSelected = (e) => {
        const file = e.target.files[0]
        fileReader = new FileReader();
        fileReader.onloadend = handleSaveFileRead
        fileReader.readAsText(file)
    }

    return (
        <Card className={classes.controlPanelCard}>
            <CardContent>
                <div style={{position:'sticky'}}>
                <Typography className={classes.title} color="textPrimary" gutterBottom>
                    Панель управления
                </Typography>
                <SaveLoadSettingsPanel/>
                <PlaybackPanel/>
                <EditorModesSettingsPanel/>
                {/*<Accordion>*/}
                {/*    <AccordionSummary*/}
                {/*        expandIcon={<ExpandMoreIcon/>}*/}
                {/*    >*/}
                {/*        <Typography className={classes.accoridionHeading}>Структура</Typography>*/}
                {/*    </AccordionSummary>*/}
                {/*    <AccordionDetails>*/}
                {/*        <TextField className={classes.textInputPadding}*/}
                {/*                   label="Размер квадрата"*/}
                {/*                   defaultValue={settings.quadratSize}*/}
                {/*                   onChange={(event => partialUpdateSettings({quadratSize: Number(event.target.value)}))}*/}
                {/*                   disabled={true}/>*/}
                {/*    </AccordionDetails>*/}
                {/*</Accordion>*/}
                <Accordion>
                    <AccordionSummary
                        expandIcon={<ExpandMoreIcon/>}
                    >
                        <Typography className={classes.accoridionHeading}>Отображение</Typography>
                    </AccordionSummary>
                    <AccordionDetails>
                        <FormControlLabel
                            value="top"
                            control={<Checkbox
                                checked={settings.displayApplicature}
                                onChange={(e) => partialUpdateSettings({displayApplicature: e.target.checked})}
                            />}
                            label="Показывать аппликатуру"></FormControlLabel>
                    </AccordionDetails>
                </Accordion>
                </div>
                {/*<EditorExportPanel/>*/}
            </CardContent>
        </Card>
    )
}
