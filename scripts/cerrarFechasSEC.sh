export WORKDIR=/Users/Arturo/aclprojects/autoSEPH
export ALUMNO_TOKEN=eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJ1c2VyIjoiYXJ0dXJvY2FzdHJvQGFjbHN5c3RlbXMubXgiLCJleHAiOjE1NjE1MDM1MzM0MjB9.QMnHaVTIp4Bgf0io8yhYhqW4eJZws1z3YD8C2h8Mk2g
cd $WORKDIR

node $WORKDIR/blockdates.js SEP-SEC-01-SEPH-001 5af8614eeff3dd001abe9eec 5af8ca4ceff3dd001abeafe4 5b0b857fdee253001bdf04e7
node $WORKDIR/blockdates.js SEP-SEC-01-SEPH-002 5af8614eeff3dd001abe9eec 5af8ca4ceff3dd001abeafe4 5b0b857fdee253001bdf04e7
node $WORKDIR/blockdates.js SEP-SEC-01-SEPH-003 5af8614eeff3dd001abe9eec 5af8ca4ceff3dd001abeafe4 5b0b857fdee253001bdf04e7