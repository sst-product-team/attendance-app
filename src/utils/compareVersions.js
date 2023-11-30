function compareVersions(version1, version2) {
  const v1 = version1.split('.').map(Number);
  const v2 = version2.split('.').map(Number);

  // Compare each component
  for (let i = 0; i < v1.length && i < v2.length; i++) {
    if (v1[i] < v2[i]) {
      return -1;
    } else if (v1[i] > v2[i]) {
      return 1;
    }
  }

  if (v1.length < v2.length) {
    return -1;
  } else if (v1.length > v2.length) {
    return 1;
  }

  return 0;
}

export default compareVersions;
