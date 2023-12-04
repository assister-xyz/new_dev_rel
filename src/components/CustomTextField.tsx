import Box from "@mui/material/Box";
import TextField from "@mui/material/TextField";
import InputAdornment from "@mui/material/InputAdornment";
import IconButton from "@mui/material/IconButton";
import SendIcon from "@mui/icons-material/Send";
import { ReactElement, useState } from "react";
import { cardBgColor } from "@/themes/colors";

export default function CustomTextField({
  ticketId,
  addTicketResponseMessageApiHandler,
}: {
  ticketId: string | undefined;
  addTicketResponseMessageApiHandler: (ticketId: string | undefined, message: string) => Promise<void>;
}): ReactElement {
  const [responseMessage, setResponseMessage] = useState<string>("");

  // --------------------------------------------------------------------------------------------------------------

  function setResponseMessageHandler(event: React.ChangeEvent<HTMLInputElement>): void {
    setResponseMessage(event.target.value);
  }

  function handleOnKeyDown(event: React.KeyboardEvent<HTMLDivElement>): void {
    if (event.key === "Enter" && responseMessage !== "") {
      console.log("handleOnKeyDown runs");
      setResponseMessage("");
      addTicketResponseMessageApiHandler(ticketId, responseMessage);
    }
  }

  function handleOnClick(): void {
    if (responseMessage !== "") {
      console.log("handleOnClick runs");
      setResponseMessage("");
      addTicketResponseMessageApiHandler(ticketId, responseMessage);
    }
  }

  /////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

  return (
    <TextField
      onKeyDown={handleOnKeyDown}
      onChange={setResponseMessageHandler}
      multiline={true}
      fullWidth
      minRows={1}
      maxRows={5}
      value={responseMessage}
      name='responseMessage'
      placeholder='Type message'
      InputProps={{
        endAdornment: (
          <InputAdornment position='end'>
            <IconButton edge='end' onClick={handleOnClick}>
              <SendIcon />
            </IconButton>
          </InputAdornment>
        ),
        sx: {
          bgcolor: cardBgColor,
          borderRadius: "15px", // Adjust border radius as per the screenshot
        },
      }}
      sx={{
        "& .MuiOutlinedInput-root": {
          "& fieldset": {
            display: "none", // Removes border
          },
          "&:hover fieldset": {
            display: "none", // Removes border on hover
          },
          "&.Mui-focused fieldset": {
            display: "none", // Removes border on focus
          },
        },
      }}
    />
  );
}
