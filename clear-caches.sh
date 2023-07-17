# run this from the affected project folder, then run npx expo start --clear
npm cache clean --force
watchman watch-del-all
rm -fr $TMPDIR/metro-cache