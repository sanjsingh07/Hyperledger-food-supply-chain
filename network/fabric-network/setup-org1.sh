export PATH=${PWD}/../bin:$PATH
export FABRIC_CFG_PATH=${PWD}/configtx
export VERBOSE=true

. scripts/utils.sh

function createOrgs() {
  if [ -d "organizations/peerOrganizations/org1.example.com" ]; then
    rm -Rf organizations/peerOrganizations/org1.example.com
  fi

  # Create crypto material using cryptogen
  # if [ "$CRYPTO" == "cryptogen" ]; then
    which cryptogen
    if [ "$?" -ne 0 ]; then
      fatalln "cryptogen tool not found. exiting"
    fi
    infoln "Generating certificates using cryptogen tool"

    infoln "Creating Org1 Identities"

    set -x
    cryptogen generate --config=./organizations/cryptogen/crypto-config-org1.yaml --output="organizations"
    res=$?
    { set +x; } 2>/dev/null
    if [ $res -ne 0 ]; then
      fatalln "Failed to generate certificates..."
    fi

  # fi

  # infoln "Generating CCP files for Org1"
  # ./organizations/ccp-generate.sh
}

createOrgs