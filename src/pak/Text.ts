import { PakmanExportResult, PakmanImportResult, PakmanLoadResult, PakmanNewResult, PakmanSaveResult, PakmanStoreResult, PakmanUnlockResult } from './Pakman'

export function toUserMessage(o: PakmanSaveResult | PakmanNewResult | PakmanUnlockResult | PakmanImportResult | PakmanExportResult | PakmanLoadResult): string {
  function toFollowupMessageStoreResult(o: PakmanStoreResult): string {
    if (o.ov === 'pakrypt.pakman_store_result:success') {
      return 'success.'
    } else if (o.ov === 'pakrypt.pakman_store_result:no_space') {
      return 'not enough space or pak is too big.'
    } else if (o.ov === 'pakrypt.pakman_store_result:pakrypt_store_failed') {
      return 'failed to store in online storage.'
    }

    return o // never
  }

  if (o.ov === 'pakrypt.pakman_save_result:success') {
    return 'Save succeeded.'
  } else if (o.ov === 'pakrypt.pakman_save_result:store_failed') {
    return 'Save failed: ' + toFollowupMessageStoreResult(o.detail)
  }

  if (o.ov === 'pakrypt.pakman_new_result:success') {
    return 'Pak was created successfully.'
  } else if (o.ov === 'pakrypt.pakman_new_result:store_failed') {
    return 'Pak creation failed: ' + toFollowupMessageStoreResult(o.detail)
  }

  if (o.ov === 'pakrypt.pakman_unlock_result:success') {
    return 'Pak was unlocked successfully.'
  } else if (o.ov === 'pakrypt.pakman_unlock_result:decode_error') {
    return 'Pak unlock failed: error decoding stored data.'
  } else if (o.ov === 'pakrypt.pakman_unlock_result:decrypt_error') {
    return 'Pak unlock failed: error decrypting stored data.'
  } else if (o.ov === 'pakrypt.pakman_unlock_result:integrity_error') {
    return 'Pak unlock failed: invalidly formatted data was found.'
  } else if (o.ov === 'pakrypt.pakman_unlock_result:local_decode_error') {
    return 'Pak unlock failed: error decoding stored local data.'
  } else if (o.ov === 'pakrypt.pakman_unlock_result:local_decrypt_error') {
    return 'Pak unlock failed: error decrypting stored local data.'
  } else if (o.ov === 'pakrypt.pakman_unlock_result:local_integrity_error') {
    return 'Pak unlock failed: invalidly formatted local data was found.'
  } else if (o.ov === 'pakrypt.pakman_unlock_result:local_rekey_error') {
    return 'Pak unlock failed: rekey of local data could not be performed.'
  } else if (o.ov === 'pakrypt.pakman_unlock_result:pakrypt_store_load_error') {
    return 'Pak unlock failed: online loading failed.'
  } else if (o.ov === 'pakrypt.pakman_unlock_result:rekey_error') {
    return 'Pak unlock failed: rekey could not be performed.'
  }

  function toFollowupMessageLoadResult(o: PakmanLoadResult): string {
    if (o.ov === 'pakrypt.pakman_load_result:success') {
      return 'success.'
    } else if (o.ov === 'pakrypt.pakman_load_result:integrity_error') {
      return 'integrity error.'
    } else if (o.ov === 'pakrypt.pakman_load_result:not_found') {
      return 'not found.'
    }

    return o // never
  }

  if (o.ov === 'pakrypt.pakman_import_result:success') {
    return 'Pak was imported successfully.'
  } else if (o.ov === 'pakrypt.pakman_import_result:load_failed') {
    return 'Pak failed to import: ' + toFollowupMessageLoadResult(o.detail)
  } else if (o.ov === 'pakrypt.pakman_import_result:no_space') {
    return 'Pak failed to import: not enough space.'
  }

  if (o.ov === 'pakrypt.pakman_export_result:success') {
    return 'Pak was exported successfully.'
  } else if (o.ov === 'pakrypt.pakman_export_result:integrity_error') {
    return 'Pak failed to export: integrity error.'
  } else if (o.ov === 'pakrypt.pakman_export_result:not_found') {
    return 'Pak failed to export: not found.'
  }

  if (o.ov === 'pakrypt.pakman_load_result:success') {
    return 'Pak was loaded successfully.'
  } else if (o.ov === 'pakrypt.pakman_load_result:integrity_error') {
    return 'Pak failed to load: integrity error.'
  } else if (o.ov === 'pakrypt.pakman_load_result:not_found') {
    return 'Pak failed to load: not found.'
  }

  return o // never
}
