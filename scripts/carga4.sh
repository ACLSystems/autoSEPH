export WORKDIR=/Users/Arturo/aclprojects/autoSEPH
export EXCDIR=/Users/Arturo/aclprojects/tarea/excgrp
export ALUMNO_TOKEN=eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJ1c2VyIjoiYXJ0dXJvY2FzdHJvQGFjbHN5c3RlbXMubXgiLCJleHAiOjE1NjE1MDM1MzM0MjB9.QMnHaVTIp4Bgf0io8yhYhqW4eJZws1z3YD8C2h8Mk2g
cd $WORKDIR
npm start $EXCDIR/HIG-101-001.xlsx silvia.mendezb@hotmail.com true
npm start $EXCDIR/HIG-101-002.xlsx silvia.mendezb@hotmail.com
npm start $EXCDIR/MPME-01-001.xlsx armando_serratom@hotmail.com true
npm start $EXCDIR/MPME-01-002.xlsx armando_serratom@hotmail.com
npm start $EXCDIR/SEP-ELE-01-001.xlsx armando_serratom@hotmail.com true
npm start $EXCDIR/SEP-ELE-01-002.xlsx armando_serratom@hotmail.com
