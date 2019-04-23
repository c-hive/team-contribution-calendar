#!/bin/sh

generate_distified_file() {
    NODE_MODULES_BIN_PATH=`pwd`/node_modules/.bin

    mkdir -p dist

    $NODE_MODULES_BIN_PATH/browserify lib/index.js --standalone TeamContributionCalendar -o dist/team-contribution-calendar.min.js

    $NODE_MODULES_BIN_PATH/uglifyjs dist/team-contribution-calendar.min.js -o dist/team-contribution-calendar.min.js

    rm -r lib
}

upload_minified_version() {
    eval "$(ssh-agent -s)"
    openssl aes-256-cbc -K $encrypted_d9591a2445c1_key -iv $encrypted_d9591a2445c1_iv -in ./scripts/id_rsa_ci.enc -out id_rsa_ci -d
    chmod 600 id_rsa_ci
    ssh-add id_rsa_ci

    git remote set-url origin git@github.com:c-hive/team-contribution-calendar.git
    git checkout master

    generate_distified_file

    git add dist/*

    git commit -m "[skip travis] Update distified version"

    git push --set-upstream origin master
}

upload_minified_version