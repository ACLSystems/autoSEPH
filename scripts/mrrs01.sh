export WORKDIR=/Users/Arturo/aclprojects/autoSEPH
export EXCDIR=/Users/Arturo/aclprojects/tarea/excgrp
export ALUMNO_TOKEN=eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJ1c2VyIjoiYXJ0dXJvY2FzdHJvQGFjbHN5c3RlbXMubXgiLCJleHAiOjE1NjE1MDM1MzM0MjB9.QMnHaVTIp4Bgf0io8yhYhqW4eJZws1z3YD8C2h8Mk2g
cd $WORKDIR
npm start $EXCDIR/MRRS-01-001.xlsx jorgeslp80@gmail.com true
npm start $EXCDIR/MRRS-01-002.xlsx jorgeslp80@gmail.com
npm start $EXCDIR/MRRS-01-003.xlsx jorgeslp80@gmail.com
npm start $EXCDIR/MRRS-01-004.xlsx jorgeslp80@gmail.com
npm start $EXCDIR/MRRS-01-005.xlsx jorgeslp80@gmail.com
npm start $EXCDIR/MRRS-01-006.xlsx jorgeslp80@gmail.com
