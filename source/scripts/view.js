const {ipcMain, dialog, desktopCapturer, shell, app} = require('electron');
const {exec} = require('child_process');
const path = require('path');
const fs = require('fs');

ipcMain.handle('sources', async event => {
  const sources = await desktopCapturer.getSources({types: ['window', 'screen']});
  const mappedSources = {};

  sources.map(source => {
    mappedSources[source.name] = {
      label: source.name,
      source: source
    };
  });

  return mappedSources;
});

/**
 * Check if a folder exists.
 * @param {string} folderPath - The path of the folder to check.
 * @return {boolean} - True if the folder exists, false otherwise.
 */
function doesFolderExist(folderPath) {
  try {
    return fs.statSync(folderPath).isDirectory();
  } catch (error) {
    return false;
  }
}

/**
 * Modifies a video file duration metadata
 * @param {string} inputFile - the path to the original video
 * @param {number} durationInSeconds - the duration to modify
 * @return {null}
 */
function changeVideoDuration(inputFile, durationInSeconds) {
  return new Promise((resolve, reject) => {
    // Extract directory and filename from the input path
    const directory = path.dirname(inputFile);
    const filename = path.basename(inputFile);

    // Remove 'temp' from the filename
    const outputFile = path.join(directory, filename.replace('temp ', ''));

    // eslint-disable-next-line max-len
    const command = `ffmpeg -i "${inputFile}" -c copy -metadata duration=${durationInSeconds} "${outputFile}"`;

    exec(command, (error, stdout, stderr) => {
      if (error) {
        reject(error);
        return;
      }

      if (stderr) {
        reject(stderr);
        return;
      }

      resolve();
    });
  });
}

ipcMain.handle('save-file', async (event, data) => {
  const {buffer, totalTime} = data;

  const defaultFolder = path.join(app.getPath('downloads'), 'recorded');
  const defaultFileName = `recorded-video-${Date.now()}.webm`;
  const defaultPath = path.join(defaultFolder, defaultFileName);

  if (!doesFolderExist(defaultFolder)) {
    try {
      fs.mkdirSync(defaultFolder);
    } catch (mkdirError) {
      if (mkdirError.code !== 'EEXIST') {
        throw mkdirError;
      }
    }
  }

  const {canceled, filePath} = await dialog.showSaveDialog(null, {
    title: 'Save Video',
    defaultPath: defaultPath
  });

  const finalSelectedFilePath = canceled ? defaultPath : filePath;

  // prefixing 'temp ' in the file name
  const selectedFilePathName = path.basename(finalSelectedFilePath);
  const selectedFilePathDirectory = path.dirname(finalSelectedFilePath);
  let finalTemporaryPath = path.join(selectedFilePathDirectory, 'temp ' + selectedFilePathName);

  const fileFormat = path.extname(finalTemporaryPath);

  if (fileFormat === '' ||fileFormat !== '.webm') {
    finalTemporaryPath += '.webm';
  }

  const newBuffer = Buffer.from(buffer);

  fs.writeFile(finalTemporaryPath, newBuffer, error => {
    if (error) {
      console.error('Failed to save the file: ', error);
      return;
    };

    const savedPath = finalTemporaryPath.replace('temp ', '');

    changeVideoDuration(finalTemporaryPath, totalTime)
        .then(() => {
          if (!canceled) {
            shell.openPath(savedPath);
          }
        })
        .catch(error => {
          if (!canceled) {
            shell.openPath(savedPath);
          }

          console.error('Error:', error);
        })
        .finally(() =>
          // deleting the temporary file
          fs.unlink(finalTemporaryPath, error => {
            if (error) {
              console.error('Error deleting file:', error);
              return;
            }
            console.log('File deleted successfully');
          })
        );
  });

  return;
});
