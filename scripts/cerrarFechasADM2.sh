export WORKDIR=/Users/Arturo/aclprojects/autoSEPH
export ALUMNO_TOKEN=eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJ1c2VyIjoiYXJ0dXJvY2FzdHJvQGFjbHN5c3RlbXMubXgiLCJleHAiOjE1NjE1MDM1MzM0MjB9.QMnHaVTIp4Bgf0io8yhYhqW4eJZws1z3YD8C2h8Mk2g
cd $WORKDIR

node $WORKDIR/blockdates.js ADM-02-SEPH-001 5d0abf79202481001737ff08 5d0abf892024810017380146 5d0ac12ef36149001726d6ac
node $WORKDIR/blockdates.js ADM-02-SEPH-002 5d0abf79202481001737ff08 5d0abf892024810017380146 5d0ac12ef36149001726d6ac
node $WORKDIR/blockdates.js ADM-02-SEPH-003 5d0abf79202481001737ff08 5d0abf892024810017380146 5d0ac12ef36149001726d6ac