import React from "react";
import {
    ClickAwayListener,
    FormControlLabel,
    Popover,
    Switch,
    TextField,
    Typography,
    withStyles
} from "@material-ui/core";
import {INote, Note, PlaybackDuration, PlaybackOffset} from "../../model/note-data";
import {NoteHand, NoteType} from "../../model/skeleton-data";
import {QUADRAT_WIDTH} from "../../model/global-constants";
import {blue, red} from "@material-ui/core/colors";

export interface BlockSchemeNodeProps {
    externalNoteObject: INote;
    setExternalNoteObject: any;//(INote, number) => SetStateAction<INote>;
    index: number;
    handType: NoteHand;
}

const FeatherSwitch = withStyles({
    switchBase: {
        color: red[500],
        '&$checked': {
            color: blue[500],
        },
        '&$checked + $track': {
            backgroundColor: blue[300],
        },
    },
    checked: {},
    track: {color: red[500],},
})(Switch);

export const SubtitleNote = ({externalNoteObject, setExternalNoteObject, index, handType}: BlockSchemeNodeProps) => {
    const [anchorEl, setAnchorEl] = React.useState<HTMLButtonElement | null>(null);

    const open = Boolean(anchorEl);
    const id = open ? 'simple-popover' : undefined;

    const handleClick = (event: React.MouseEvent<HTMLButtonElement>) => {
        setAnchorEl(event.currentTarget);

    };
    const handleClose = () => {
        setAnchorEl(null);
    };

    const handleNoteUpdate = (data: Partial<INote>) => {
        const updatedNote = new Note({
            note: data.note || externalNoteObject.note,
            octave: data.octave || externalNoteObject.octave,
            applicature: data.applicature || externalNoteObject.applicature,
            duration: externalNoteObject.duration,
            playbackOffset: externalNoteObject.playbackOffset,
            noteType: data.noteType || externalNoteObject.noteType
        });
        console.log( updatedNote)
        setExternalNoteObject(updatedNote)

    }

    const getRelativeTop = (note: INote) => {
        const rightHandTop = 60 - (externalNoteObject.getMidiNumber() - 48) * 2.5;
        const leftHandTop = (60 - externalNoteObject.getMidiNumber()) * 2.5;
        const top = handType === NoteHand.RIGHT ? rightHandTop : leftHandTop;
        return top
    }

    const getRelativeLeft = (note: INote) => {
        if (note.duration === PlaybackDuration.FULL && note.playbackOffset === PlaybackOffset.NONE) {
            return {
                left: 0,
                right: 0
            }
        } else {
            return {
                left: 5 + QUADRAT_WIDTH * note.playbackOffset
            }
        }
    }
    return (
        <ClickAwayListener onClickAway={handleClose}>
            <div style={{
                position: "absolute",
                marginLeft: "auto",
                marginRight: "auto",
                textAlign: "center",
                top: getRelativeTop(externalNoteObject),
                zIndex: 10 + index,
                ...getRelativeLeft(externalNoteObject)
            }}>
                <span onClick={handleClick}>{externalNoteObject.note}</span>
                <Popover
                    id={id}
                    open={open}
                    anchorEl={anchorEl}
                    onClose={handleClose}
                    anchorOrigin={{
                        vertical: 'center',
                        horizontal: 'right',
                    }}
                    transformOrigin={{
                        vertical: 'center',
                        horizontal: 'left',
                    }}
                >
                    <div style={{padding: 10, display: "flex", flexDirection: "column"}}>
                        <div style={{padding: 10, display: "flex", flexDirection: "row"}}>
                            <TextField style={{paddingRight: 10, width: 50}}
                                       defaultValue={externalNoteObject.note}
                                       label="Нота"
                                       InputLabelProps={{
                                           shrink: true,
                                       }}
                                       inputProps={{maxLength: 4}}
                                       onChange={event => {
                                           handleNoteUpdate({note: event.target.value})
                                       }}
                            />

                            <TextField style={{paddingRight: 10, width: 50}}
                                       defaultValue={externalNoteObject.octave}
                                       label="Октава"
                                       type="number"
                                       InputLabelProps={{
                                           shrink: true,
                                       }}
                                       inputProps={{maxLength: 4}}
                                       onChange={event => {
                                           handleNoteUpdate({octave: Number(event.target.value)})
                                       }}
                            />
                        </div>
                        <div style={{padding: 10, display: "flex", flexDirection: "row"}}>
                            <TextField style={{paddingRight: 10, width: 70}}
                                       defaultValue={externalNoteObject.applicature}
                                       id="standard-number"
                                       label="Аппликатура"
                                       InputLabelProps={{
                                           shrink: true,
                                       }}
                                       inputProps={{width: 50}}
                                       onChange={event => {
                                           handleNoteUpdate({applicature: event.target.value})
                                       }}
                            />
                            {handType === NoteHand.RIGHT && <FormControlLabel
                                control={<FeatherSwitch checked={externalNoteObject.noteType===NoteType.FEATHER}
                                                        onChange={(event) => {
                                                            handleNoteUpdate({noteType:event.target.checked ? NoteType.FEATHER: NoteType.REGULAR})
                                                        }}></FeatherSwitch>}
                                labelPlacement="top"
                                label={<Typography
                                    style={{color: "gray", fontSize: "small"}}>Оперение</Typography>}
                            />}
                        </div>
                    </div>
                </Popover>
            </div>
        </ClickAwayListener>
    )
}