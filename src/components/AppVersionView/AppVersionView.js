import React, {useEffect, useState} from 'react';
import {View, Text, Pressable, Linking, ActivityIndicator} from 'react-native';
import useAppVersion from '../../hooks/useAppVersion';
import compareVersions from '../../utils/compareVersions';

const AppVersionView = () => {
  const versionDetails = useAppVersion();

  let content;
  if (versionDetails.status === 'loading') {
    content = <ActivityIndicator color="white" size={47} />;
  } else if (versionDetails.status === 'error') {
    content = (
      <Text
        style={{
          marginTop: '6%',
          marginLeft: '5%',
          color: '#ffffff',
        }}>
        {versionDetails.message}
      </Text>
    );
  } else {
    content = (
      <>
        <Text
          style={{
            fontSize: 18,
            marginTop: '6%',
            marginLeft: '5%',
            color: '#ffffff',
          }}>
          {versionDetails ? `LATEST VERSION :  ${versionDetails.version}` : ''}
        </Text>
        <Text
          style={{
            fontSize: 18,
            marginTop: '6%',
            marginLeft: '5%',
            color: '#ffffff',
          }}></Text>

        {/* <View style={{width: '100%', alignItems: 'center'}}> */}
        {compareVersions(
          versionDetails.APP_VERSION,
          versionDetails ? versionDetails.version : APP_VERSION,
        ) < 0 ? (
          <Pressable
            style={{
              width: '70%',
              backgroundColor: '#12142d',
              padding: 20,
              justifyContent: 'center',
              alignItems: 'center',
              marginTop: '13%',
              borderRadius: 20,
            }}
            onPress={async () => {
              await Linking.openURL(versionDetails.APK_FILE);
            }}>
            <Text style={{color: 'white'}}>
              {versionDetails.buttonButtonText}
            </Text>
          </Pressable>
        ) : (
          ''
        )}
      </>
    );
  }

  return (
    <View
      style={{
        alignItems: 'center',
        padding: 20,
      }}>
      <Text
        style={{
          fontSize: 18,
          marginTop: '6%',
          marginLeft: '5%',
          color: '#ffffff',
        }}>
        v{versionDetails.APP_VERSION}
      </Text>
      {content}
    </View>
  );
};

export default AppVersionView;
