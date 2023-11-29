import React, {useEffect, useState} from 'react';
import {domain_URL, APP_VERSION} from '../constants';

const useAppVersion = () => {
  const [latestAPPDATA, setLatestAPPDATA] = useState({
    APP_VERSION: APP_VERSION,
    status: 'loading',
  });

  useEffect(() => {
    const fn = async () => {
      try {
        let data = await fetch(domain_URL + '/attendance/version');
        data = await data.json();
        setLatestAPPDATA({
          APP_VERSION,
          status: 'ok',
          buttonButtonText: 'Download Latest App',
          ...data,
        });
      } catch (error) {
        setLatestAPPDATA({
          ...latestAPPDATA,
          status: 'error',
          message: 'Failed to fetch app version data',
        });
      }
    };
    fn();
  }, []);

  return latestAPPDATA;
};

export default useAppVersion;
