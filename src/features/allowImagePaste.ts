import {makeBTDModule} from '../types/btdCommonTypes';

export const allowImagePaste = makeBTDModule(({jq}) => {
  document.addEventListener('paste', async (ev) => {
    if (!ev.clipboardData || !ev.target) {
      return;
    }

    const items = ev.clipboardData.items;

    if (!items) {
      return;
    }

    const files: File[] = [];

    await (async () => {
      for (let item of Array.from(items)) {
        if (item.type.indexOf('image') < 0) {
          continue;
        }
        const blob = item.getAsFile();
        if (!blob) {
          continue;
        }

        const maxFileSize = 5242880;
        if (blob.size < maxFileSize) {
          files.push(blob);
        } else {
          try {
            let file = blob;
            do file = await resizeImage(file, maxFileSize);
            while (file.size > maxFileSize);
            files.push(file);
          } catch (err) {
            console.log(err);
          }
        }
      }
    })();

    if (files.length === 0) {
      return;
    }

    const canPopout =
      jq('.js-inline-compose-pop, .js-reply-popout').length > 0 &&
      !jq('.js-app-content').hasClass('is-open');

    const findTextbox = jq(ev.target)
      .closest('.js-column')
      .find('.js-inline-compose-pop, .js-reply-popout');

    if (canPopout) {
      if (findTextbox.length > 0) {
        jq(findTextbox).trigger('click');
      } else {
        jq('.js-inline-compose-pop, .js-reply-popout').first().trigger('click');
      }

      setTimeout(() => {
        jq(document).trigger('uiFilesAdded', {
          files,
        });
      }, 0);
      return;
    }

    jq(document).trigger('uiFilesAdded', {
      files,
    });
  });
});

function resizeImage(file: File, capaticy: number): Promise<File> {
  return new Promise((resolve, reject) => {
    const compressibility = Math.sqrt(capaticy / file.size);
    const image = new Image();
    image.onload = () => {
      const canvas = document.createElement('canvas');
      canvas.width = image.naturalWidth * compressibility;
      canvas.height = image.naturalHeight * compressibility;

      const ctx = canvas.getContext('2d');
      if (ctx == null) {
        reject('cannot get context.');
        return;
      }

      ctx.drawImage(
        image,
        0,
        0,
        image.naturalWidth,
        image.naturalHeight,
        0,
        0,
        canvas.width,
        canvas.height
      );

      canvas.toBlob((blob) => {
        if (blob == null) {
          reject('cannot convert canvas to blob.');
          return;
        }
        resolve(new File([blob], file.name, {type: file.type, lastModified: file.lastModified}));
      });
    };

    const reader = new FileReader();
    reader.onload = () => {
      if (typeof reader.result == 'string') image.src = reader.result;
    };

    reader.readAsDataURL(file);
  });
}
