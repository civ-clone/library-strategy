#!/bin/bash

set -x

component=$(basename $(realpath .));

perl -p0i -e 's/package-template/'$component'/g' package.json README.md;

read -p "Would you like to remove the test packages? [y/N]";

if [[ Yy = *$REPLY* ]]; then
  npm r @types/chai @types/chai-spies @types/mocha c8 chai chai-spies mocha ts-mocha;
  perl -p0i -e 's/\n      - run: npm run test:coverage//g' .github/workflows/build-on-push.yml;
  perl -p0i -e 's/^\s*"test":\s*"ts-mocha ./tests/*.test.ts",\s*"test:coverage":\s*"c8 ts-mocha ./tests/*.test.ts",\m//g' package.json;
fi

read -p "Would you like to remove index.ts? [y/N]";

if [[ Yy = *$REPLY* ]]; then
  rm index.ts;
  perl -p0i -e 's/^\s*"main":\s*"index.js",\n//g' package.json;
fi

if [[ $component = civ1-* ]]; then
  yarn set version classic;
  yarn install;
  perl -p0i -e 's/npm (run )?/yarn/g' .github/workflows/build-on-push.yml;
  rm package-lock.json;
  used-modules-no-test | xargs yarn add;
else
  used-modules-no-test | xargs npm i;
  rm .yarnrc.yml;
fi

rm build.sh;
