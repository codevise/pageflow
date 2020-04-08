
import $ from 'jquery';

export const readyDeferred = new $.Deferred();
export const ready = readyDeferred.promise();