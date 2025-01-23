/**
 * 提供给h5的方法
 */
export const useBridge = () => {
  const saveNetImageToPhotosAlbum = (url: string) => {
    if (url.startsWith('http')) {
      uni.downloadFile({
        url,
        success: (res) => {
          const filePath = res.tempFilePath
          uni.saveImageToPhotosAlbum({
            filePath,
          })
        },
      })
    }
  }
  const checkAuthSettingHelper = (setting: keyof UniApp.AuthSetting) => {
    let hasAuth = false
    uni.getSetting({
      success: (res) => {
        if (res.authSetting[setting]) {
          hasAuth = true
        } else {
          uni.authorize({
            scope: setting,
            success: () => {
              hasAuth = true
            },
            fail: () => {
              uni.showModal({
                title: '提示',
                content: '检测到您没打开保存图片的权限，是否去设置打开？',
                confirmText: '去设置',
                cancelText: '取消',
                success: (res) => {
                  if (res.confirm) {
                    uni.openSetting()
                  } else {
                    hasAuth = false
                  }
                },
                fail: () => {
                  hasAuth = false
                },
              })
            },
          })
        }
      },
    })
    return hasAuth
  }

  const saveBase64ImageToPhotosAlbum = (base64: string) => {
    const hasAuth = checkAuthSettingHelper('scope.writePhotosAlbum')
    if (!hasAuth) {
      return
    }
    const filePath = `${wx.env.USER_DATA_PATH}/${Date.now()}.jpg`
    uni.getFileSystemManager().writeFile({
      filePath,
      data: base64,
      encoding: 'base64',
      success: () => {
        uni.saveImageToPhotosAlbum({
          filePath,
          success: () => {
            uni.showToast({
              title: '保存成功',
              icon: 'none',
            })
          },
          fail: () => {
            uni.showToast({
              title: '保存失败',
              icon: 'none',
            })
          },
        })
      },
      fail: () => {
        uni.showToast({
          title: '保存失败',
          icon: 'none',
        })
      },
    })
  }

  return {
    saveNetImageToPhotosAlbum,
    saveBase64ImageToPhotosAlbum,
  }
}
