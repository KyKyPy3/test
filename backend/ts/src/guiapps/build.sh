rm -r ./client/*

arg=$1

for d in ./projects/* ; do

  dir_name=$(basename $d)

  # npm run version --prefix "$d"/web
  npm run pack:release --prefix "$d"/web
  cp -r "$d"/web/release/* ./client


done

